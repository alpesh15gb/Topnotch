<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateGoogleDriveBackup;
use App\Models\Backup;
use App\Services\BackupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    public function __construct(private BackupService $backupService) {}

    public function index(): JsonResponse
    {
        $backups = Backup::latest()->paginate(20);
        return response()->json($backups);
    }

    public function triggerLocal(): JsonResponse
    {
        $backup = $this->backupService->createLocalBackup();
        return response()->json($backup, 201);
    }

    public function triggerGoogleDrive(): JsonResponse
    {
        $backup = Backup::create([
            'type' => 'google_drive',
            'filename' => 'backup_' . date('Y_m_d_H_i_s') . '.sql',
            'status' => 'pending',
        ]);

        GenerateGoogleDriveBackup::dispatch($backup);

        return response()->json(['message' => 'Google Drive backup queued', 'backup' => $backup], 202);
    }

    public function download(Backup $backup): BinaryFileResponse|JsonResponse
    {
        if ($backup->status !== 'completed' || !$backup->path || !file_exists($backup->path)) {
            return response()->json(['message' => 'Backup file not available'], 404);
        }

        return response()->download($backup->path);
    }

    public function connectGoogleDrive(Request $request): JsonResponse
    {
        // Handle Google OAuth callback
        return response()->json(['message' => 'Google Drive connected']);
    }
}
