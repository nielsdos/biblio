<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;

/**
 * Adds fulltext search to a model.
 * Requires an array field 'searchable' to determine which fields are searchable,
 *   and 'sortable' to determine which fields are sortable.
 */
trait SearchTrait {
    /**
     * Search
     *
     * @param Builder $query
     * @param string $term
     * @return Builder
     */
    public function scopeSearch(Builder $query, string $term): Builder {
        $query = $this->prepareSearchQuery($query);

        if($term !== '') {
            $cols = implode(',', $this->searchable);
            $term = cleanupBooleanModeParameter($term . '*');
            $query = $query->whereRaw("MATCH ({$cols}) AGAINST (? IN BOOLEAN MODE)", $term);
        }

        return $query;
    }

    /**
     * Sort
     *
     * @param Builder $query
     * @param string $orderDir
     * @param string $orderField
     * @return Builder
     */
    public function scopeSort(Builder $query, string $orderDir, string $orderField): Builder {
        if(($orderDir === 'asc' || $orderDir === 'desc')
            && in_array($orderField, $this->sortable)) {
            $query = $query->orderBy($orderField, $orderDir);
        }

        return $query;
    }

    /**
     * Prepare search query with extra data if wanted.
     *
     * @param Builder $query
     * @return Builder
     */
    protected function prepareSearchQuery(Builder $query): Builder {
        return $query;
    }
}
