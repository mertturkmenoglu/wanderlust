// import { UserIcon } from "lucide-react";
// import { Button } from "~/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";
// import { AuthDto } from "~/lib/dto";
// import MenuContent from "./menu-content";

// type Props = {
//   auth: AuthDto;
// };

// export default function Menu({ auth }: Readonly<Props>) {
//   return (
//     <div>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button className="rounded-full" variant="ghost">
//             <UserIcon className="size-5 text-black" />
//             <span className="sr-only">Menu</span>
//             <span className="hidden sm:ml-2 sm:block">
//               {auth.data.fullName}
//             </span>
//           </Button>
//         </DropdownMenuTrigger>
//         <MenuContent
//           fullName={auth.data.fullName}
//           username={auth.data.username}
//         />
//       </DropdownMenu>
//     </div>
//   );
// }

export default function Menu() {
  return <></>;
}
