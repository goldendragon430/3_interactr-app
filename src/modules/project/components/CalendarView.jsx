import React from 'react';
import CalendarCard from "./CalendarCard";
import CalendarMonth from "./CalendarMonth";
import {motion} from 'framer-motion'

const AUGUST_2020 = {
  year: '2020',
  month: 'AUGUST',
  niche: 'Dentist',
  items: [
    {
      title: 'Dentist Live Action',
      template_id: 19999,
    },
    {
      title: 'Dentist Live Action',
      template_id: 20017,
    },
    {
      title: 'Dentist Live Action',
      template_id: 20032,
    },
    {
      title: 'Converti Landing Page',
      url: 'https://google.com',
      image: 'https://s3.us-east-2.amazonaws.com/thumbs.swiftcdn.co/NxQ7U1Ocw9uGbqkNqxLEIsPX3V1Iba1546793972.jpg'
    },
    {
      title: 'ClickFunnels Landing Page',
      url: 'https://google.com',
      image: 'https://s3.us-east-2.amazonaws.com/thumbs.swiftcdn.co/NxQ7U1Ocw9uGbqkNqxLEIsPX3V1Iba1546793972.jpg'
    },
  ]
};

const SEPTEMBER_2020 = {
  year: '2020',
  month: 'SEPTEMBER',
  niche: 'Yoga Studio',
  items: [
    {
      title: 'Dentist Live Action',
      template_id: 19999,
    },
    {
      title: 'Dentist Live Action',
      template_id: 20017,
    },
    {
      title: 'Dentist Live Action',
      template_id: 20032,
    },
    {
      title: 'Converti Landing Page',
      url: 'https://google.com',
      image: 'https://s3.us-east-2.amazonaws.com/thumbs.swiftcdn.co/NxQ7U1Ocw9uGbqkNqxLEIsPX3V1Iba1546793972.jpg'
    },
    {
      title: 'ClickFunnels Landing Page',
      url: 'https://google.com',
      image: 'https://s3.us-east-2.amazonaws.com/thumbs.swiftcdn.co/NxQ7U1Ocw9uGbqkNqxLEIsPX3V1Iba1546793972.jpg'
    },
  ]
};

const OCTOBER_2020 = {
  year: '2020',
  month: 'OCTOBER',
  niche: 'Real Estate',
  items: [
    {
      title: 'Dentist Live Action',
      template_id: 19999,
    },
    {
      title: 'Dentist Live Action',
      template_id: 20017,
    },
    {
      title: 'Dentist Live Action',
      template_id: 20032,
    },
    {
      title: 'Converti Landing Page',
      url: 'https://google.com',
      image: 'https://s3.us-east-2.amazonaws.com/thumbs.swiftcdn.co/NxQ7U1Ocw9uGbqkNqxLEIsPX3V1Iba1546793972.jpg'
    },
    {
      title: 'ClickFunnels Landing Page',
      url: 'https://google.com',
      image: 'https://s3.us-east-2.amazonaws.com/thumbs.swiftcdn.co/NxQ7U1Ocw9uGbqkNqxLEIsPX3V1Iba1546793972.jpg'
    },
  ]
};

const CalendarView = () => {
  const list =  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x:0, transition: {type: 'ease-in'} }
  }

  return(
    <motion.div initial="hidden" animate="show"  variants={list}>
      <motion.div  variants={item} >
        <CalendarMonth options={OCTOBER_2020} />
      </motion.div>
      <motion.div  variants={item} >
        <CalendarMonth options={SEPTEMBER_2020} />
      </motion.div>
      <motion.div  variants={item} >
        <CalendarMonth options={AUGUST_2020} />
      </motion.div>

    </motion.div>
  )
};
export default CalendarView;

