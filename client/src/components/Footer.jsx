const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{ padding: '20px' }}>
      &copy; {currentYear} Daniel Michael
    </footer>
  );
}
