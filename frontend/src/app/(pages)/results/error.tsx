'use client';
export default function Error({error}:{error:Error}){
  return (
    <div>
      <h2>Oops! {error.message}</h2>
    </div>
  );
}
