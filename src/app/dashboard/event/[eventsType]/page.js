"use client";

import SearchEventGlobalCompo from '@/components/SearchEventGlobalCompo';
import React from 'react';
import Events from './simpleEvents';


const Page = ({limit}) => {

  return (
    <SearchEventGlobalCompo limit={limit} />
  );
};
  
export default Page;