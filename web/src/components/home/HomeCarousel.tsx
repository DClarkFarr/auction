import { Carousel } from "flowbite-react";

export function HomeCarousel() {
    return (
        <div className="h-56 sm:h-64 lg:h-auto lg:aspect-[2]">
            <Carousel slide={false}>
                <ImageSlide />
                <TwoColumn />
                <FullBackground />
            </Carousel>
        </div>
    );
}

function ImageSlide() {
    return (
        <div className="slide">
            <img
                className="w-full object-center object-cover "
                src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                alt="..."
            />
        </div>
    );
}

function TwoColumn() {
    return (
        <div className="slide h-full w-full lg:flex items-stretch">
            <div className="max-w-full shrink w-full lg:w-[450px] flex h-full flex-col text-white bg-purple-700 p-4 lg:p-10 justify-center lg:justify-start items-center lg:items-center">
                <h1 className="text-4xl font-bold mb-4">This is a title</h1>
                <p>Aand this is a big paragraph that we like</p>
            </div>
            <div className="">
                <div className="overflow-hidden">
                    <img
                        className="w-full object-center object-cover "
                        src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                        alt="..."
                    />
                </div>
            </div>
        </div>
    );
}

function FullBackground() {
    return (
        <div className="slide h-full w-full relative">
            <div className="absolute top-0 left-0 right-0 bottm-0">
                <img
                    className="w-full object-center object-cover "
                    src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                    alt="..."
                />
            </div>
            <div className="slide h-full w-full relative">
                <div className="max-w-full shrink w-full lg:w-1/2 flex h-full flex-col text-purple-800 p-4 lg:p-10 justify-center items-center">
                    <div className="p-4 bg-white/50">
                        <h1 className="text-4xl font-bold mb-4">
                            This is a title
                        </h1>
                        <p>Aand this is a big paragraph that we like</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
