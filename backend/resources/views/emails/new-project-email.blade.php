<x-mail::message>
    # New Project Assignment

    Hello,

    You have been added to the **{{ $project->name }}** project by a manager.

    **Project Description:**
    {{ $project->description }}

    

    Thanks,
    {{ config('app.name') }}
</x-mail::message>