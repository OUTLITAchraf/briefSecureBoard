<x-mail::message>
    # New Project Assignment

    Hello,

    You have been added to the **{{ $project->name }}** project by a manager.

    **Project Description:**
    {{ $project->description }}

    <x-mail::button :url="url('/projects/' . $project->id)">
        View Project
    </x-mail::button>

    Thanks,
    {{ config('app.name') }}
</x-mail::message>