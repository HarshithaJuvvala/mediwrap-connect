
import { Discussion } from "@/types/community";

export const initialDiscussions: Discussion[] = [
  {
    id: 1,
    author: "Dr. Sarah Johnson",
    authorType: "Verified Doctor",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Heart Health",
    title: "Understanding Heart Palpitations: When to Worry",
    content: "Many people experience heart palpitations, which can feel like the heart is pounding, fluttering, or skipping a beat. Most of the time, heart palpitations are harmless and are caused by stress, anxiety, caffeine, or exercise. However, in some cases, they can be a sign of a more serious heart condition...",
    date: "2 days ago",
    likes: 45,
    comments: 12,
    verified: true
  },
  {
    id: 2,
    author: "Emily Rodriguez",
    authorType: "Patient",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Mental Health",
    title: "Coping Strategies for Anxiety During Pandemic",
    content: "I've been struggling with anxiety since the pandemic began, and I wanted to share some strategies that have helped me. Firstly, establishing a routine has been crucial. I wake up at the same time every day, have set work hours, and make time for exercise and relaxation...",
    date: "5 days ago",
    likes: 78,
    comments: 23,
    verified: false
  },
  {
    id: 3,
    author: "Dr. Michael Chen",
    authorType: "Verified Doctor",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Sleep Health",
    title: "Improving Your Sleep Quality: Evidence-Based Tips",
    content: "As a neurologist specializing in sleep disorders, I often encounter patients struggling with poor sleep quality. Here are some evidence-based strategies to improve your sleep: Maintain a consistent sleep schedule, create a restful environment, avoid screens before bedtime...",
    date: "1 week ago",
    likes: 112,
    comments: 34,
    verified: true
  },
  {
    id: 4,
    author: "Robert Miller",
    authorType: "Patient",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    topic: "Chronic Pain",
    title: "Living with Chronic Back Pain: My Journey",
    content: "I've been dealing with chronic back pain for over 10 years now, and I wanted to share my journey and what has helped me. After trying numerous treatments, from physical therapy to medication, I've found that a combination approach works best for me...",
    date: "2 weeks ago",
    likes: 67,
    comments: 29,
    verified: false
  }
];
