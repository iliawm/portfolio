import Shardone from "@/Components/Shard-one";
import DockComponent from "@/Components/ui/dock";

export default function Home() {
  return (
    <main className="bg-black w-full h-full ">
      <section className="w-full h-full overflow-y-auto overflow-x-hidden">
          <Shardone/>
        <DockComponent/>
      </section>
   
    </main>
  );
}
