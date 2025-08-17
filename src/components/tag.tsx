import Image from "next/image";

export default function Tag({ text }: {text: String}) {
  return (
    <div className="bg-blue-500 border-blue-800 border-4 rounded-full mr-2 px-2 py-0.5 flex flex-row items-center">
      <Image src="/tag.svg" width={20} height={20} alt="tag icon" className="mr-1"/>
      <p>{text}</p>
    </div>
  );
}