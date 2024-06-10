import pageNotFoundImg from '../assets/images/404-not-found.png';

export default function NotFound() {
  return (
    <section className='text-center mt-20'>
      <div className='mb-8'>
        <img src={pageNotFoundImg} alt='a 404 error img' className='m-auto w-1/3'/>
      </div>
      <p className='text-xl'>404 Page Not Found!</p>
    </section>
  );
}