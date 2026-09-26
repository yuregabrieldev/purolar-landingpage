const USER = 'PuroLar';
const PASSWORD = 'PuroLar#2026';

export function middleware(request) {
  const authorization = request.headers.get('authorization') || '';
  const expected = `Basic ${btoa(`${USER}:${PASSWORD}`)}`;

  if (authorization !== expected) {
    return new Response('Acesso reservado.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="PuroLar — materiais reservados", charset="UTF-8"' }
    });
  }

  return undefined;
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
