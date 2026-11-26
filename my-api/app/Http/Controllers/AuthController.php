<?php

namespace App\Http\Controllers;

use App\Models\AuthUser;
use App\Models\CurrentUserSession;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = AuthUser::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // TTL Resolution
        $defaultTtl = (int) env('JWT_DEFAULT_TTL_HOURS', 12);
        $ttl = $user->jwt_ttl_hours ?? $defaultTtl;
        $ttl = max(1, min(24, $ttl)); // Clamp 1-24

        // Create Session
        $authSessionId = Str::random(64);
        $expireDatetime = now()->addHours($ttl);

        CurrentUserSession::create([
            'auth_session_id' => $authSessionId,
            'user_id' => $user->user_id,
            'logon_datetime' => now(),
            'expire_datetime' => $expireDatetime,
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
        ]);



        // Generate JWT
        $payload = [
            'iss' => 'my-api',
            'sub' => $user->user_id,
            'jti' => $authSessionId,
            'iat' => now()->timestamp,
            'exp' => $expireDatetime->timestamp,
        ];
        
        $token = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return response()->json([
            'user_info' => [
                'user_id' => $user->user_id,
                'username' => $user->username,
            ],
            'token' => $token,
            'expire_datetime' => $expireDatetime->toIso8601String(),
        ]);
    }

    public function logout(Request $request)
    {
        // Middleware ensures we have a valid token. Extract JTI.
        $authHeader = $request->header('Authorization');
        $token = substr($authHeader, 7);
        $decoded = JWT::decode($token, new \Firebase\JWT\Key(env('JWT_SECRET'), 'HS256'));

        // Soft delete the session
        CurrentUserSession::where('auth_session_id', $decoded->jti)->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}