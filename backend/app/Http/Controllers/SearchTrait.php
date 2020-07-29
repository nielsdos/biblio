<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

trait SearchTrait {
    public function index(Request $request) {
        $page = (int) $request->query('page');
        $perPage = (int) $request->query('per_page');
        $orderDir = (string) $request->query('order_dir');
        $orderField = (string) $request->query('order_field');
        $q = (string) $request->query('q');

        $source = $this->getSearchModel()::search($q)->sort($orderDir, $orderField);

        if($page < 1) {
            $page = 1;
        }
        if($perPage < 1) {
            $perPage = 1;
        } elseif($perPage > 50) {
            $perPage = 50;
        }

        $users = $source->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $this->getSearchResource()::collection($users)->jsonSerialize(),
            'total' => $users->total(),
            'page' => $page,
        ];
    }

    /**
     * Get the search model class
     *
     * @return mixed
     */
    protected abstract function getSearchModel();

    /**
     * Get the JSON resource class
     *
     * @return mixed
     */
    protected abstract function getSearchResource();
}
