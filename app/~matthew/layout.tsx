export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style href="academic" precedence="high">
        {
          "body{background:#fff;background-image:none;color:#000;overflow:hidden}"
        }
      </style>
      {children}
    </>
  );
}
