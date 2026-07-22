import { prisma } from "./client";

async function main() {
    const count = await prisma.document.count();

    console.log("Documents:", count);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });