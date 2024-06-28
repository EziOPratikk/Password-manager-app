export default function Footer() {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <footer className='py-2 text-center fixed bottom-0 left-0 right-0'>
      © {currentYear} Pratik Khadka Inc. All right reserved
    </footer>
  );
}