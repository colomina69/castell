import prisma from "./prisma";

export async function getSocios() {
    try {
        const socios=await prisma.socios.findMany()
        return {socios}
    } catch (error) {
        return {error}
    }
}