import landingPages from "./landingPages";

const dfyContent = {
  2021: {
    'january' : {
      landingPage: landingPages[2021].january,
      projects: [22673, 22672, 22671],
      niche: 'Beauty Salon'
    }
  },
  2020: {
    'december' : {
      landingPage: landingPages[2020].december,
      projects: [1, 2, 3],
      niche: 'Chiropractor'
    },
    'november' : {
      landingPage: landingPages[2020].november,
      projects: [1, 2, 3],
      niche: 'Dentist'
    },
    'october' : {
      landingPage: landingPages[2020].october,
      projects: [1, 2, 3],
      niche: 'Gym'
    },
    'september' : {
      landingPage: landingPages[2020].september,
      projects: [1, 2, 3],
      niche: 'Personal Trainer'
    },
    'august' : {
      landingPage: landingPages[2020].august,
      projects: [1, 2, 3],
      niche: 'Real Estate'
    },
    'july' : {
      landingPage: landingPages[2020].july,
      projects: [1, 2, 3],
      niche: 'Yoga Studio'
    },
  }
}

export const currentMonth = {
  heading: 'New Done for You Content for January',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a turpis eleifend, varius est nec, suscipit lorem. Suspendisse in diam finibus, finibus erat et, sollicitudin lacus. Donec sit amet gravida dui, at tincidunt ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean non felis in elit venenatis iaculis.',
  image: 'https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/shutterstock_491820835+%5BConverted%5D.png',
  content: dfyContent[2021]['january']
}

export default dfyContent;