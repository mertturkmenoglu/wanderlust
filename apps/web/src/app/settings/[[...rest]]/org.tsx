import { OrganizationSwitcher, OrganizationProfile } from "@clerk/nextjs";

function Org() {
  return (
    <div className="my-12">
      <OrganizationSwitcher />
      <OrganizationProfile />
    </div>
  );
}

export default Org;
