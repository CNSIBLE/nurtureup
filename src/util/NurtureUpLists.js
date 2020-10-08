import React from "react";
import {
  IconCarSeatTech, IconChildbirthEd,
  IconLaborDoula, IconLactation, IconMealPrep,
  IconMidwife, IconNewbornCare,
  IconNursery, IconPhotographer,
  IconPostDoula, IconSleepConsultant
} from "../components";

export const EDUCATION_LEVELS = [
  { level: '1', label: 'None' },
  { level: '2', label: 'High School' },
  { level: '3', label: 'Trade School' },
  { level: '4', label: 'Bachelors' },
  { level: '5', label: 'Masters' },
  { level: '6', label: 'Doctorate' },
];

export const PREFERENCES = [
  {key: '1', label: 'Works mornings'},
  {key: '2', label: 'Works evenings'},
  {key: '3', label: 'No smoking'},
  {key: '4', label: 'Ok with pets'},
  {key: '5', label: 'Works nights'},
  {key: '6', label: 'CPR/First Aid Certified'},
  {key: '7', label: '24 hour care'},
];

export const SERVICE_TYPES = [
  {key: '1', label: 'Labor Doula', icon: <IconLaborDoula />},
  {key: '2', label: 'Midwife', icon: <IconMidwife />},
  {key: '3', label: 'Nursery/Home consultant', icon: <IconNursery />},
  {key: '4', label: 'Postpartum Doula', icon: <IconPostDoula />},
  {key: '5', label: 'Car Seat Technician', icon: <IconCarSeatTech />},
  {key: '6', label: 'Lactation Consultant', icon: <IconLactation />},
  {key: '7', label: 'Sleep Consultant', icon: <IconSleepConsultant />},
  {key: '8', label: 'Newborn Care Specialist', icon: <IconNewbornCare />},
  {key: '9', label: 'Infant & Pregnancy Photography', icon: <IconPhotographer />},
  {key: '10', label: 'Childbirth Education Classes', icon: <IconChildbirthEd />},
  {key: '11', label: 'Meal Prep', icon: <IconMealPrep />},
];
