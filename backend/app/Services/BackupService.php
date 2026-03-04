<?php

namespace App\Services;

use App\Models\Backup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BackupService
{
    public function dumpDatabase(): string
    {
        $filename = 'backup_' . date('Y_m_d_H_i_s') . '.sql';
        $path = storage_path("app/backups/{$filename}");

        $config = config('database.connections.pgsql');
        $command = sprintf(
            'PGPASSWORD=%s pg_dump -h %s -U %s -d %s -f %s',
            escapeshellarg($config['password']),
            escapeshellarg($config['host']),
            escapeshellarg($config['username']),
            escapeshellarg($config['database']),
            escapeshellarg($path)
        );

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \RuntimeException('Database dump failed');
        }

        return $path;
    }

    public function createLocalBackup(): Backup
    {
        $backup = Backup::create([
            'type' => 'local',
            'filename' => 'backup_' . date('Y_m_d_H_i_s') . '.sql',
            'status' => 'pending',
        ]);

        try {
            $dumpPath = $this->dumpDatabase();
            $size = filesize($dumpPath);

            $backup->update([
                'status' => 'completed',
                'path' => $dumpPath,
                'size' => $size,
                'completed_at' => now(),
            ]);
        } catch (\Exception $e) {
            $backup->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            throw $e;
        }

        return $backup;
    }

    public function uploadToGoogleDrive(string $filePath): string
    {
        // Google Drive upload logic using league/flysystem-google-cloud
        // Returns the file ID
        $disk = Storage::disk('google');
        $fileName = basename($filePath);
        $disk->put($fileName, file_get_contents($filePath));
        return $fileName; // In real impl, return drive file ID
    }
}
