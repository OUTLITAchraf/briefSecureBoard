<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\NewProjectEmail;

class NewProjectNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): NewProjectEmail
    {
        return (new NewProjectEmail($this->project))->to($notifiable->email);
    }
}