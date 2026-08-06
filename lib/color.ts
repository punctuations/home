import sharp from "sharp";

export async function fac(url: string) {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const buffer = Buffer.from(await res.arrayBuffer());

    const { data, info } = await sharp(buffer).resize(64, 64).toFormat("raw")
        .toBuffer({ resolveWithObject: true });

    let best_h = 0, best_s = 0, best_v = 0;

    for (let i = 0; i < data.length; i += info.channels) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        const s = max == 0 ? 0 : delta / max;
        const v = max;

        // Only consider sufficiently saturated colors to avoid grays
        if (v < 0.45 || v > 0.92) continue;

        if (s > best_s) {
            best_s = s;
            best_v = v;
            //compute hue
            if (delta == 0) {
                best_h = 0;
                continue;
            }
            if (max == r) best_h = ((g - b) / delta) % 6;
            else if (max == g) best_h = (b - r) / delta + 2;
            else best_h = (r - g) / delta + 4;
            best_h = Math.round(best_h * 60);
            if (best_h < 0) best_h += 360;
        }
    }

    if (best_s === 0) {
        const { dominant } = await sharp(buffer).resize(1, 1).toFormat("raw")
            .stats();
        return `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;
    }

    const h = best_h, s = best_s, v = best_v;
    const f = (n: number) => {
        const k = (n + h / 60) % 6;
        return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };

    const r = Math.round(f(5) * 255);
    const g = Math.round(f(3) * 255);
    const b = Math.round(f(1) * 255);

    return `rgb(${r}, ${g}, ${b})`;
}
