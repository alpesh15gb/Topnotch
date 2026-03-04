<?php

namespace App\Jobs;

use App\Models\Backup;
use App\Services\BackupService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateGoogleDriveBackup implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 600;

    public function __construct(public readonly Backup $backup) {}

    public function handle(BackupService $backupService): void
    {
        try {
            $dumpPath = $backupService->dumpDatabase();
            $driveFileId = $backupService->uploadToGoogleDrive($dumpPath);

            $this->backup->update([
                'status' => 'completed',
                'path' => $dumpPath,
                'size' => filesize($dumpPath),
                'drive_file_id' => $driveFileId,
                'completed_at' => now(),
            ]);
        } catch (\Exception $e) {
            $this->backup->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
