<?php

namespace App\Jobs;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Notifications\NewProjectNotification;

class SendProjectNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    public function handle(): void
    {
        $teamMembers = $this->project->teamMembers;

        if ($teamMembers->count() > 0) {
            foreach ($teamMembers as $member) {
                $member->notify(new NewProjectNotification($this->project));
            }
        }
    }
}