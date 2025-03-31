import Link from "next/link";
export default function Header() {
  return (
    <div className="">
      <div className="h-[100px] bg-amber-300 items-center p-5 flex justify-between">
      
        <Link href="https://www.miningwebs.in/">
          <h1 className="h-[50px] text-2xl bg-black w-[200px] rounded shadow-gray-500 text-center leading-12">
            MiningWebs.in
          </h1>
        </Link>
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnT9u6_Xg2gv1nyUP4n2hYl8dKMCbRuaaP-VPfrVbgEoXbRVFADiUvxqNYr0-0PVfSlJ93poQvS0x-15U64pyzAU388asUF2MDBORSc3SiFNGIzSOglfOfUVEeuYR6BLM0xIscRSx60-kGRJWG0-Ra5JHh5RkVhTYMBe4HU2dkKdUJzDRFy4SNjDFV/w349-h400-rw/1.png" alt="" srcSet="" width={50} height={50}/>
      </div>
    </div>
  );
}
