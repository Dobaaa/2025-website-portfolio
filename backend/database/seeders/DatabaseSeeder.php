<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'elhwtdoba@gmail.com'],
            [
                'name' => 'Ahmed Jamal',
                'password' => 'Admin@12345',
            ]
        );

        $confidentialMessage = 'This project is a private dashboard that controls another business, so I can\'t share a live link. You can browse the screenshots here, and I can walk you through the system in a meeting.';

        SiteSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'hero_label' => 'Ahmed Jamal portfolio',
                'hero_title' => 'Transforming Concepts into Seamless User Experiences',
                'hero_subtitle' => "Hi! I'm Ahmed Jamal, a Software Engineer & Salesforce Developer based in Egypt.",
                'footer_heading' => 'Ready to take your digital presence to the next level?',
                'footer_text' => "Reach out to me today and let's discuss how I can help you achieve your goals.",
                'contact_email' => 'elhwtdoba@gmail.com',
                'copyright_text' => 'Copyright © 2025 Ahmed Jamal',
                'confidential_default_message' => $confidentialMessage,
            ]
        );

        if (Project::query()->exists()) {
            return;
        }

        $projects = [
            [
                'title' => 'Saboba (Booking Web App)',
                'short_description' => 'Full stack responsive booking reservation web app used to book workers, with many pages, business logic, and fine details.',
                'details' => 'A large booking platform built to manage worker reservations, availability, and client flows. The system includes multiple operational pages and detailed booking logic. Because it powers a live business, the dashboard cannot be publicly shared.',
                'cover_image' => null,
                'live_url' => null,
                'github_url' => 'https://github.com/Dobaaa/Saboba-App',
                'access_type' => 'confidential',
                'technologies' => ['React', 'Tailwind', 'TypeScript'],
            ],
            [
                'title' => '3s System (Workspace Management)',
                'short_description' => 'Workspace management dashboard built with React.',
                'details' => 'An internal workspace management dashboard used to run another business. Live access is private, but screenshots and a meeting walkthrough are available.',
                'cover_image' => null,
                'live_url' => null,
                'github_url' => 'https://github.com/Dobaaa/3s-system',
                'access_type' => 'confidential',
                'technologies' => ['React', 'Next.js', 'TypeScript'],
            ],
            [
                'title' => 'Pentola restaurant website',
                'short_description' => 'Restaurant website with a polished marketing experience.',
                'details' => 'A public restaurant website with a visual menu-driven experience.',
                'cover_image' => null,
                'live_url' => 'https://dobaaa.github.io/pizzaa-website/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['React', 'Tailwind', 'TypeScript'],
            ],
            [
                'title' => 'Sales Data Visualization Dashboard',
                'short_description' => 'Full-stack dashboard for quarterly sales data with interactive charts.',
                'details' => 'A private analytics dashboard for sales reporting. Built with React, Three.js, Laravel, and MySQL. The live system is not shareable because it contains business data.',
                'cover_image' => null,
                'live_url' => null,
                'github_url' => 'https://github.com/Dobaaa/AALLIE-TASK',
                'access_type' => 'confidential',
                'technologies' => ['React', 'Laravel', 'Three.js'],
            ],
            [
                'title' => 'WListDB Games Website',
                'short_description' => 'Games website with content and listings.',
                'details' => 'A public games website currently live at wlistdb.com.',
                'cover_image' => null,
                'live_url' => 'https://wlistdb.com/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['Next.js', 'Tailwind', 'TypeScript'],
            ],
            [
                'title' => 'POS System',
                'short_description' => 'Point of sale system for products, suppliers, and operations.',
                'details' => 'A POS dashboard used to manage products, suppliers, and store operations. Because it controls another business, visitors can view screenshots only or see it in a meeting.',
                'cover_image' => null,
                'live_url' => null,
                'github_url' => 'https://github.com/Dobaaa/pos-',
                'access_type' => 'confidential',
                'technologies' => ['React', 'Laravel'],
            ],
            [
                'title' => 'Solar Website',
                'short_description' => 'Responsive website converted from a Figma design.',
                'details' => 'A production solar company website converted from Figma into a responsive experience.',
                'cover_image' => null,
                'live_url' => 'https://www.skyline-power.com/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['CSS3', 'TypeScript'],
            ],
            [
                'title' => 'VIXI AI',
                'short_description' => 'Private product dashboard and related pages.',
                'details' => 'A private product interface. Screenshots can be reviewed here, and a full walkthrough can happen in a meeting.',
                'cover_image' => null,
                'live_url' => null,
                'github_url' => 'https://github.com/Dobaaa/Nextjs-ISLAM',
                'access_type' => 'confidential',
                'technologies' => ['Next.js', 'Tailwind'],
            ],
            [
                'title' => 'Arabian Dexterity',
                'short_description' => 'Company website delivered for Arabian Dexterity.',
                'details' => 'A public company website currently live for Arabian Dexterity.',
                'cover_image' => null,
                'live_url' => 'https://dexterity.com.sa/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['Next.js', 'JavaScript'],
            ],
            [
                'title' => 'Azix Solutions',
                'short_description' => 'Company website for Azix Solutions.',
                'details' => 'A public marketing website currently live for Azix Solutions.',
                'cover_image' => null,
                'live_url' => 'https://www.azixsolutions.com/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['Next.js', 'Tailwind'],
            ],
            [
                'title' => '3D Portfolio',
                'short_description' => 'Personal website built with React, Three.js, and Tailwind CSS.',
                'details' => 'An interactive 3D personal website.',
                'cover_image' => null,
                'live_url' => 'https://dobazworld.netlify.app/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['React', 'Three.js', 'Tailwind'],
            ],
            [
                'title' => 'El Ghanem',
                'short_description' => 'Company website for El Ghanem.',
                'details' => 'A public website currently live for El Ghanem.',
                'cover_image' => null,
                'live_url' => 'https://ghanem.com.mx/',
                'github_url' => null,
                'access_type' => 'public',
                'technologies' => ['React', 'Tailwind'],
            ],
            [
                'title' => 'Flower Mob App',
                'short_description' => 'Angular Ionic e-commerce flower app.',
                'details' => 'A mobile e-commerce flower application built with Angular and Ionic.',
                'cover_image' => null,
                'live_url' => null,
                'github_url' => 'https://github.com/Dobaaa/angular-ionic-flower-app',
                'access_type' => 'public',
                'technologies' => ['Angular', 'Ionic', 'JavaScript'],
            ],
        ];

        foreach ($projects as $index => $project) {
            Project::query()->create([
                ...$project,
                'confidential_message' => $project['access_type'] === 'confidential' ? $confidentialMessage : null,
                'sort_order' => $index + 1,
                'is_published' => true,
            ]);
        }

        foreach ([
            [
                'quote' => 'Ahmed did excellent work. He has good communication skills and very responsive. Would definitely hire him again.',
                'name' => 'Murat Gultepe',
                'title' => 'Director of Solar Company',
            ],
            [
                'quote' => "Collaborating with Ahmed J was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project.",
                'name' => 'Softa Solutions Company',
                'title' => 'CEO of Softa Solutions Company',
            ],
            [
                'quote' => 'Working with Ahmed was a seamless experience. His attention to detail, creative approach, and ability to communicate effectively made the entire process smooth and enjoyable.',
                'name' => 'Muhammed Hussien',
                'title' => 'Head of Digital Strategy at Nova Solutions',
            ],
            [
                'quote' => 'Collaborating with Ahmed on our front-end revamp was a fantastic experience. His mastery of modern frameworks and UI/UX detail elevated our product.',
                'name' => 'Omar El-Masry',
                'title' => 'Lead Product Manager at BrightLoop Studios',
            ],
            [
                'quote' => 'I was genuinely impressed by Ahmed\'s commitment and technical know-how. He consistently delivered beyond expectations.',
                'name' => 'Daniel Monroe',
                'title' => 'Marketing Director at PixelWave Medias',
            ],
        ] as $index => $item) {
            Testimonial::query()->create([
                ...$item,
                'sort_order' => $index + 1,
                'is_published' => true,
            ]);
        }

        foreach ([
            [
                'title' => 'Frontend Engineer',
                'description' => 'Worked on several large React JS systems, integrating backend APIs and creating responsive web apps.',
            ],
            [
                'title' => 'Software Engineer',
                'description' => 'Developed and maintained modern, responsive web applications using React.js and other front-end and backend technologies.',
            ],
            [
                'title' => 'Freelance App Dev Project',
                'description' => 'Worked with clients from different countries on Freelancer.com and Upwork.com across many project types.',
            ],
            [
                'title' => 'Frontend Developer',
                'description' => 'Developed and maintained user-facing features using modern frontend technologies.',
            ],
        ] as $index => $item) {
            Experience::query()->create([
                ...$item,
                'sort_order' => $index + 1,
                'is_published' => true,
            ]);
        }

        foreach ([
            ['name' => 'GitHub', 'url' => 'https://github.com/Dobaaa', 'icon' => 'github'],
            ['name' => 'WhatsApp', 'url' => 'https://wa.me/201211998934', 'icon' => 'whatsapp'],
            ['name' => 'LinkedIn', 'url' => 'https://www.linkedin.com/in/ahmed-jamal-3a509b220/', 'icon' => 'linkedin'],
        ] as $index => $item) {
            SocialLink::query()->create([
                ...$item,
                'sort_order' => $index + 1,
                'is_published' => true,
            ]);
        }
    }
}
