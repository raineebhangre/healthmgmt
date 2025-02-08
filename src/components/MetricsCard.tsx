import React from "react";
import { IconChevronRight, IconHeartHandshake } from '@tabler/icons-react';

const MetricsCard = ({
    title,
    subtitle,
    value,
    icon: Icon,
    onClick
})=>(
    <div className="flex flex-col rounded-xl border bg-white shadow-sm
    dark:border-neutral-800 dark:bg-[#13131a]
    ">
        <div className="flex justify-between gap-x-3 p-4 md:p-5">
            <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                    {title}
                </p>
                <div className="mt-1 flex items-center gap-x-2">
                    <h3
                    className="text-xl font-medium text-neutral-200 sm:text-2xl">
                        {value}
                    </h3>

                </div>

            </div>
            <div className="flex size-[46px] h-11 w-11 
            flex-shrink-0 items-center rounded-full bg-blue-600 dark:bg-[#1c1c24] text-blue-200">
                <Icon size={25} className ='text-green-500'/>

        </div>

        </div>
        <a href="#"
        onClick={onClick}
        className="  border-gray-200 inline-flex items-center justify-between rounded-b-xl border-t px-4 py-3 text-sm md:px-5
        text-neutral-400 hover:bg-neutral-800
        "
        >
            {subtitle}
            <IconChevronRight />

        </a>
        

    </div>

);
export default MetricsCard;