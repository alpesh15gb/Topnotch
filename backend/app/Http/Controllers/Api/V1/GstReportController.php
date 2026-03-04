<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\GstService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GstReportController extends Controller
{
    public function __construct(private GstService $gstService) {}

    public function gstr1(Request $request): JsonResponse
    {
        $request->validate(['period' => 'required|date_format:Y-m']);
        return response()->json($this->gstService->computeGSTR1($request->period));
    }

    public function gstr2(Request $request): JsonResponse
    {
        $request->validate(['period' => 'required|date_format:Y-m']);
        return response()->json($this->gstService->computeGSTR2($request->period));
    }

    public function gstr3b(Request $request): JsonResponse
    {
        $request->validate(['period' => 'required|date_format:Y-m']);
        return response()->json($this->gstService->computeGSTR3B($request->period));
    }

    public function exportJson(Request $request): JsonResponse
    {
        $request->validate([
            'return_type' => 'required|in:GSTR1,GSTR2,GSTR3B',
            'period' => 'required|date_format:Y-m',
        ]);

        $data = $this->gstService->exportJSON($request->return_type, $request->period);

        return response()->json($data);
    }

    public function hsnSummary(Request $request): JsonResponse
    {
        $request->validate(['period' => 'required|date_format:Y-m']);
        $gstr1 = $this->gstService->computeGSTR1($request->period);

        return response()->json($gstr1['hsn'] ?? []);
    }
}
