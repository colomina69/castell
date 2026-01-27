import { Header } from "@/components/layout/Header";
import { Gallery } from "@/components/home/Gallery";
import { Footer } from "@/components/layout/Footer";

export default function GalleryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
                <Gallery />
            </main>
            <Footer />
        </div>
    );
}
