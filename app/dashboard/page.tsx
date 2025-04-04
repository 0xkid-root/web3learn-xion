"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Abstraxion, useModal } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import { Tab } from '@headlessui/react';
import { BookOpenIcon, AcademicCapIcon, TrophyIcon, WalletIcon, BeakerIcon } from '@heroicons/react/24/outline';
import "@burnt-labs/ui/dist/index.css";
import { useXionWallet } from "../hooks/useXionWallet";
import CourseContent from "../components/CourseContent";

const courses = [
  {
    id: 1,
    category: "XION Blockchain Fundamentals",
    courses: [
      {
        title: "Introduction to XION Blockchain",
        description: "Learn about XION's unique features, architecture, and ecosystem",
        level: "Beginner",
        duration: "2 weeks",
        modules: 8,
        progress: 0,
        xionReward: 50
      },
      {
        title: "XION Smart Contracts",
        description: "Build and deploy smart contracts on XION blockchain",
        level: "Intermediate",
        duration: "4 weeks",
        modules: 12,
        progress: 0,
        xionReward: 100
      }
    ]
  },
  {
    id: 2,
    category: "DeFi & Trading on XION",
    courses: [
      {
        title: "XION DeFi Fundamentals",
        description: "Explore DeFi applications and opportunities on XION",
        level: "Intermediate",
        duration: "3 weeks",
        modules: 10,
        progress: 0,
        xionReward: 75
      },
      {
        title: "Advanced XION Trading",
        description: "Master trading strategies specific to XION ecosystem",
        level: "Advanced",
        duration: "6 weeks",
        modules: 15,
        progress: 0,
        xionReward: 150
      }
    ]
  },
  {
    id: 3,
    category: "XION Development",
    courses: [
      {
        title: "Building on XION",
        description: "Learn to develop applications on XION blockchain",
        level: "Advanced",
        duration: "8 weeks",
        modules: 20,
        progress: 0,
        xionReward: 200
      },
      {
        title: "XION Network Security",
        description: "Understanding security principles and best practices",
        level: "Advanced",
        duration: "5 weeks",
        modules: 15,
        progress: 0,
        xionReward: 125
      }
    ]
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const { address, isConnected, isConnecting, getBalance } = useXionWallet();
  const [, setShow] = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [balance, setBalance] = useState<{ amount: number; denom: string } | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [activeCourse, setActiveCourse] = useState<any>(null);

  useEffect(() => {
    if (!isConnecting && isConnected) {
      setIsLoading(false);
      fetchBalance();
    }
  }, [isConnected, isConnecting]);

  useEffect(() => {
    if (isConnected && !isLoading) {
      router.push("/dashboard");
    } else if (!isConnected && !isConnecting && !isLoading) {
      router.push("/login");
    }
  }, [isConnected, isConnecting, isLoading, router]);

  const fetchBalance = async () => {
    const bal = await getBalance();
    if (bal) setBalance(bal);
  };

  const startCourse = (course: any) => {
    setActiveCourse(course);
  };

  const handleCourseComplete = () => {
    setTotalEarned(prev => prev + (activeCourse?.xionReward || 0));
    setActiveCourse(null);
    // Here you would typically make an API call to update the user's progress and token balance
  };

  if (isLoading || isConnecting) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>Connecting to XION network... Please wait.</p>
      </div>
    );
  }

  if (activeCourse) {
    return (
      <CourseContent
        course={activeCourse}
        onComplete={handleCourseComplete}
        onBack={() => setActiveCourse(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-800 via-teal-700 to-green-500">
      <header className="bg-black bg-opacity-30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Web3Learn Learn Dashboard</h1>
          {address && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                <WalletIcon className="h-5 w-5 text-white mr-2" />
                <span className="text-gray-300">
                  {balance ? `${balance.amount.toFixed(2)} ${balance.denom}` : "Loading..."}
                </span>
              </div>
              <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                <BeakerIcon className="h-5 w-5 text-white mr-2" />
                <span className="text-gray-300">
                  Earned: {totalEarned} XION
                </span>
              </div>
              <span className="text-gray-300">Address: {address.slice(0, 6)}...{address.slice(-4)}</span>
              <Button
                onClick={() => setShow(true)}
                structure="base"
              >
                Account
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpenIcon, title: "Courses Enrolled", value: "4" },
            { icon: AcademicCapIcon, title: "Hours Learned", value: "24" },
            { icon: AcademicCapIcon, title: "Certificates", value: "2" },
            { icon: TrophyIcon, title: "XION Earned", value: `${totalEarned}` }
          ].map((stat, index) => (
            <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md">
              <div className="flex items-center">
                <stat.icon className="h-8 w-8 text-white mr-3" />
                <div>
                  <p className="text-sm text-gray-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md">
          <Tab.Group selectedIndex={selectedCategory} onChange={setSelectedCategory}>
            <Tab.List className="flex space-x-2 rounded-xl bg-blue-900/20 p-1 mb-6">
              {courses.map((category) => (
                <Tab
                  key={category.id}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  {category.category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {courses.map((category, idx) => (
                <Tab.Panel
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {category.courses.map((course, courseIdx) => (
                    <div key={courseIdx} className="bg-white bg-opacity-5 rounded-lg p-6 hover:bg-opacity-10 transition-all">
                      <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-gray-300 mb-4">{course.description}</p>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Level</p>
                          <p className="text-white">{course.level}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="text-white">{course.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Modules</p>
                          <p className="text-white">{course.modules}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Reward</p>
                          <p className="text-white">{course.xionReward} XION</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-2/3 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <Button
                          structure="base"
                          onClick={() => startCourse(course)}
                        >
                          Start Course
                        </Button>
                      </div>
                    </div>
                  ))}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      
      <Abstraxion onClose={() => setShow(false)} />
    </main>
  );
}