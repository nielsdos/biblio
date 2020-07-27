<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserInvite extends Notification {
    use Queueable;

    private $email;
    private $token;

    /**
     * Create a notification instance.
     *
     * @param  string  $email
     * @param  string  $token
     * @return void
     */
    public function __construct($email, $token) {
        $this->email = $email;
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        return (new MailMessage)
                    ->subject(__('auth.invite.subject'))
                    ->line(__('auth.invite.line1'))
                    ->line(__('auth.invite.line2', ['count' => config('auth.user_invite_timeout')]))
                    ->action(__('auth.invite.subject'), url(route('auth.invite', [
                        'email' => $this->email,
                        'token' => $this->token,
                    ], false)));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable) {
        return [
            //
        ];
    }
}
