import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-xl mx-auto text-center py-20">
          {/* 404 Display */}
          <div className="relative mb-6 select-none">
            <span className="text-[10rem] md:text-[14rem] font-display font-black leading-none text-gradient opacity-20">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10rem] md:text-[14rem] font-display font-black leading-none text-gradient">
                404
              </span>
            </div>
          </div>

          <h1 className="text-display-md font-display text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-foreground-muted text-base md:text-lg leading-relaxed mb-10 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to
            a new location.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href="/">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                <ArrowLeft className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
