type AuthLegalFooterProps = {
  variant: "register" | "login";
};

export function AuthLegalFooter({ variant }: AuthLegalFooterProps) {
  const lead =
    variant === "register"
      ? "By registering, you agree to our"
      : "By signing in, you agree to our";

  return (
    <footer className="pt-8 text-center">
      <p className="text-[10px] font-nq-label text-nq-outline uppercase tracking-[0.2em] leading-relaxed">
        {lead} <br />
        <a className="hover:text-nq-primary transition-colors" href="#">
          Legal Terms
        </a>{" "}
        &amp;{" "}
        <a className="hover:text-nq-primary transition-colors" href="#">
          Privacy Protocol
        </a>
      </p>
    </footer>
  );
}
