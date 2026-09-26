import { next } from '@vercel/functions';

const EXPECTED_AUTH = 'Basic UHVyb0xhcjpQdXJvTGFyIzIwMjY=';

export default function middleware(request) {
  const authorization = request.headers.get('authorization') || '';

  if (authorization !== EXPECTED_AUTH) {
    return new Response('Acesso reservado.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="PuroLar-reservado"' }
    });
  }

  return next();
}

export const config = {
  matcher: [
    '/recursos-purolar',
    '/identidade',
    '/cartoes',
    '/purolar-variacoes-aprovadas',
    '/assets/:path*'
  ]
};
