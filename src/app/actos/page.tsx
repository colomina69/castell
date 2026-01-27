import { Header } from "@/components/layout/Header";
import { Events } from "@/components/home/Events";
import { Footer } from "@/components/layout/Footer";

export default function ActsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
                <Events />
            </main>
            <Footer />
        </div>
    );
}
