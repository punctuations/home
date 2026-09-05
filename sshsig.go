package main

import (
	"bytes"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/pem"
	"errors"
	"strings"

	"golang.org/x/crypto/ssh"
)

const signaturePreamble = "SSHSIG"

var byteOrderMark = []byte{0xEF, 0xBB, 0xBF}

var (
	errNotASignature   = errors.New("not an ssh signature")
	errUnknownVersion  = errors.New("unsupported signature version")
	errUnknownHash     = errors.New("unsupported hash algorithm")
	errWrongNamespace  = errors.New("signature was made for another namespace")
	errSignatureFailed = errors.New("signature does not match the message")
)

type wireSignature struct {
	Version   uint32
	PublicKey string
	Namespace string
	Reserved  string
	HashAlgo  string
	Signature string
}

type wireSigned struct {
	Namespace string
	Reserved  string
	HashAlgo  string
	Hash      string
}

type wireBlob struct {
	Format string
	Blob   []byte
	Rest   []byte `ssh:"rest"`
}

type signedClaim struct {
	Key       ssh.PublicKey
	Namespace string
	hashAlgo  string
	signature *ssh.Signature
}

func parseSignature(armored []byte) (*signedClaim, error) {
	block, _ := pem.Decode(bytes.TrimSpace(bytes.TrimPrefix(armored, byteOrderMark)))
	if block == nil || block.Type != "SSH SIGNATURE" {
		return nil, errNotASignature
	}

	body := block.Bytes
	if len(body) < len(signaturePreamble) || string(body[:len(signaturePreamble)]) != signaturePreamble {
		return nil, errNotASignature
	}

	var wire wireSignature
	if err := ssh.Unmarshal(body[len(signaturePreamble):], &wire); err != nil {
		return nil, errNotASignature
	}
	if wire.Version != 1 {
		return nil, errUnknownVersion
	}

	key, err := ssh.ParsePublicKey([]byte(wire.PublicKey))
	if err != nil {
		return nil, errNotASignature
	}

	var inner wireBlob
	if err := ssh.Unmarshal([]byte(wire.Signature), &inner); err != nil {
		return nil, errNotASignature
	}

	return &signedClaim{
		Key:       key,
		Namespace: wire.Namespace,
		hashAlgo:  wire.HashAlgo,
		signature: &ssh.Signature{Format: inner.Format, Blob: inner.Blob},
	}, nil
}

func (c *signedClaim) verify(message []byte, namespace string) error {
	if c.Namespace != namespace {
		return errWrongNamespace
	}

	var digest []byte
	switch c.hashAlgo {
	case "sha512":
		sum := sha512.Sum512(message)
		digest = sum[:]
	case "sha256":
		sum := sha256.Sum256(message)
		digest = sum[:]
	default:
		return errUnknownHash
	}

	signed := append(
		[]byte(signaturePreamble),
		ssh.Marshal(wireSigned{
			Namespace: c.Namespace,
			HashAlgo:  c.hashAlgo,
			Hash:      string(digest),
		})...,
	)

	if err := c.Key.Verify(signed, c.signature); err != nil {
		return errSignatureFailed
	}
	return nil
}

func (c *signedClaim) matches(authorized []authorizedKey) (authorizedKey, bool) {
	mine := c.Key.Marshal()

	for _, candidate := range authorized {
		key, _, _, _, err := ssh.ParseAuthorizedKey([]byte(candidate.Line))
		if err != nil {
			continue
		}
		if bytes.Equal(key.Marshal(), mine) {
			return candidate, true
		}
	}
	return authorizedKey{}, false
}

func (c *signedClaim) fingerprint() string {
	return ssh.FingerprintSHA256(c.Key)
}

func (c *signedClaim) algorithm() string {
	return strings.TrimPrefix(c.Key.Type(), "ssh-")
}

func (c *signedClaim) digest() string {
	return c.hashAlgo
}
