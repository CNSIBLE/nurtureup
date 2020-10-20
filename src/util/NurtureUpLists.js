import React from "react";
import {
  IconCarSeatTech, IconChildbirthEd,
  IconLaborDoula, IconLactation, IconMealPrep,
  IconMidwife, IconNewbornCare,
  IconNursery, IconPhotographer,
  IconPostDoula, IconSleepConsultant
} from "../components";

export const EDUCATION_LEVELS = [
  { level: '0', label: 'None' },
  { level: '1', label: 'High School' },
  { level: '2', label: 'Trade School' },
  { level: '3', label: 'Bachelors' },
  { level: '4', label: 'Masters' },
  { level: '5', label: 'Doctorate' },
];

export const PREFERENCES = [
  {key: '0', label: 'Works mornings'},
  {key: '1', label: 'Works evenings'},
  {key: '2', label: 'No smoking'},
  {key: '3', label: 'Ok with pets'},
  {key: '4', label: 'Works nights'},
  {key: '5', label: 'CPR/First Aid Certified'},
  {key: '6', label: '24 hour care'},
];

export const SERVICE_TYPES = [
  {key: '0', label: 'Labor Doula', icon: <IconLaborDoula />},
  {key: '1', label: 'Midwife', icon: <IconMidwife />},
  {key: '2', label: 'Nursery/Home consultant', icon: <IconNursery />},
  {key: '3', label: 'Postpartum Doula', icon: <IconPostDoula />},
  {key: '4', label: 'Car Seat Technician', icon: <IconCarSeatTech />},
  {key: '5', label: 'Lactation Consultant', icon: <IconLactation />},
  {key: '6', label: 'Sleep Consultant', icon: <IconSleepConsultant />},
  {key: '7', label: 'Newborn Care Specialist', icon: <IconNewbornCare />},
  {key: '8', label: 'Infant & Pregnancy Photography', icon: <IconPhotographer />},
  {key: '9', label: 'Childbirth Education Classes', icon: <IconChildbirthEd />},
  {key: '10', label: 'Meal Prep', icon: <IconMealPrep />},
];
