<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\CurrentUserSession;
use App\Models\AuthUser;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['error' => 'Missing token'], 401);
        }

        $token = substr($authHeader, 7);
        $secret = env('JWT_SECRET');

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid or expired token'], 401);
        }

        $session = CurrentUserSession::where('auth_session_id', $decoded->jti)->first();
        if (!$session || $session->expire_datetime < now()) {
            return response()->json(['error' => 'Session revoked or expired'], 401);
        }

        // --- DEFENSE IN DEPTH: Check X-User-Id header ---
        $headerUserId = $request->header('X-User-Id');
        
        // 1. If React sent the header, it MUST match the JWT
        if ($headerUserId && $headerUserId !== $decoded->sub) {
            return response()->json(['error' => 'Unauthorized: User ID mismatch'], 403);
        }
        
        // 2. Ensure token identity matches session row
        if ($session->user_id !== $decoded->sub) {
            return response()->json(['error' => 'Token mismatch'], 401);
        }

        $user = AuthUser::find($session->user_id);
        if (!$user) {
            return response()->json(['error' => 'User account disabled'], 401);
        }

        auth()->login($user);
        return $next($request);
    }
}