import { Link } from "react-router";

type NotFoundPageProps = {
  message: string;
  backHome: string;
};

function NotFoundPage({ message, backHome }: NotFoundPageProps) {
  return (
    <section>
      <h1>404</h1>
      <p>{message}</p>
      <Link to="/">{backHome}</Link>
    </section>
  );
}

export default NotFoundPage;
