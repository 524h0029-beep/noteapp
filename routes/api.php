<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PasswordResetController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/email/verify', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Email xác thực đã được gửi!']);
    });

    // Notes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);
    Route::post('/notes/{id}/images', [NoteController::class, 'uploadImage']);
    Route::delete('/notes/{id}/images/{imageId}', [NoteController::class, 'deleteImage']);

    // Note password
    Route::post('/notes/{id}/set-password', [NoteController::class, 'setPassword']);
    Route::post('/notes/{id}/change-password', [NoteController::class, 'changePassword']); // MỚI
    Route::post('/notes/{id}/verify-password', [NoteController::class, 'verifyPassword']);
    Route::post('/notes/{id}/remove-password', [NoteController::class, 'removePassword']);

    // Labels
    Route::get('/labels', [LabelController::class, 'index']);
    Route::post('/labels', [LabelController::class, 'store']);
    Route::put('/labels/{id}', [LabelController::class, 'update']);
    Route::delete('/labels/{id}', [LabelController::class, 'destroy']);
    Route::post('/notes/{id}/labels', [LabelController::class, 'attachToNote']);

    // Shares
    Route::post('/notes/{id}/share', [ShareController::class, 'share']);
    Route::get('/notes/{id}/shares', [ShareController::class, 'getShares']);
    Route::delete('/shares/{id}', [ShareController::class, 'revoke']);
    Route::put('/shares/{id}/permission', [ShareController::class, 'updatePermission']); // MỚI
    Route::get('/shared-with-me', [ShareController::class, 'sharedWithMe']);
    Route::get('/shares/unseen-count', [ShareController::class, 'unseenCount']); // MỚI
    Route::post('/shares/mark-all-seen', [ShareController::class, 'markAllSeen']); // MỚI
    Route::get('/shares/{id}/view', [ShareController::class, 'viewSharedNote']);
    Route::put('/shares/{id}/update', [ShareController::class, 'updateSharedNote']);

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);
    Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences']);
});
