<?php

use Illuminate\Support\Facades\Route;

Route::post('/auth/login', 'AuthController@login');
Route::post('/auth/logout', 'AuthController@logout');
Route::post('/auth/register', 'AuthController@register');
Route::post('/auth/forgot', 'ForgotPasswordController@sendResetLinkEmail');
Route::post('/auth/reset', 'ResetPasswordController@reset');
Route::get('/auth/resetform', 'ForgotPasswordController@resetForm')->name('password.reset');
Route::get('/auth/invite', 'InviteController@inviteForm')->name('auth.invite');
Route::get('/auth/loginpage', 'AuthController@loginPage')->name('login');
Route::get('/user', 'AuthController@user');
Route::get('/users', 'UserController@index');
Route::get('/users/invites', 'InviteController@index');
Route::post('/users/invites', 'InviteController@create');
Route::delete('/users/invites/{userInvite}', 'InviteController@destroy');
Route::get('/borrowers', 'BorrowerController@index');
Route::post('/borrowers', 'BorrowerController@create');
Route::put('/borrowers/{borrower}', 'BorrowerController@update');
Route::get('/books', 'BookController@index');
Route::post('/books/lookup', 'BookController@lookup');
Route::post('/books', 'BookController@create');
Route::get('/books/suggest', 'BookController@suggest');
