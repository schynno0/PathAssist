export default function Footer() {
  return (
    <footer className="border-t py-8 bg-secondary">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PathAssist. All rights reserved.</p>
        <p className="text-sm mt-1">Your trusted partner in health diagnostics.</p>
      </div>
    </footer>
  );
}
