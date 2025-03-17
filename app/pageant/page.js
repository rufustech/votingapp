import Header from "../components/Header";
import Models from "../components/Models";
import Nav from "../components/Nav";
import SideBar from "../components/SideBar";

function page() {
  return (
    <div>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <Header />
        
        {/* Sidebar */}
        <SideBar />
        <main className="p-4 md:ml-64 h-auto pt-20">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <section className="ezy__about12 light pt-14 md:pt-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
              <div className="container px-4">
                <div className="grid grid-cols-12 gap-5 justify-center items-center">
                  <div className="col-span-12 lg:col-span-6">
                    <div className="lg:px-7">
                      <h1 className="uppercase text-4xl md:text-5xl leading-tight font-medium mb-2">
                        Pageant Crown Vote
                      </h1>
                      <p className="text-lg leading-normal opacity-75 my-6">
                        Completely network collaborative web services via
                        user-centric initiatives. Quickly promote sticky testing
                        procedures collaborator before unique process
                        improvements. Since our inception set out in 2012, TalEx
                        has set out to disrupt inception the HR &amp;
                        Talent/Staffing Management industry. Purposefully
                        designed by our founders (Amrita Grewal and Julie Dacar)
                        to connect great companies and great talent.
                      </p>
                      <div className="mt-12">
                        <button className="bg-gray-900 text-white hover:bg-opacity-90 dark:bg-white dark:text-black rounded-md px-7 py-3 transition">
                          Pageants
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <div className="flex justify-center lg:justify-start lg:ml-12">
                      <img
                        src="/pinkmodel.png"
                        alt="Pink Model"
                        className="max-w-full h-[700px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Models />
              <Models />
              <Models />
            </section>
          </main>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
          </div>
          <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
          </div>
          <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
            <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72" />
          </div> */}
        </main>
      </div>
    </div>
  );
}

export default page;
