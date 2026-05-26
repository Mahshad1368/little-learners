export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-berry/30 bg-berry/10 p-6 text-center text-berry">
      <p className="text-lg font-extrabold">{message}</p>
    </div>
  );
}
