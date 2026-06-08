import { Link } from '@tanstack/react-router';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wanderlust/ui/components/collapsible';
import {
	Sidebar as ShadcnSidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@wanderlust/ui/components/sidebar';
import { ChevronRight, HomeIcon } from 'lucide-react';

export function AppSidebar() {
	return (
		<ShadcnSidebar variant="sidebar">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Wanderlust</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link className="flex w-full" to="/">
										<HomeIcon />
										<span>Home</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<Collapsible
					title="Categories"
					defaultOpen
					className="group/collapsible"
				>
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger>
								Categories{' '}
								<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/categories">List Categories</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/categories/new">
												Create Category
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Collapsible title="cities" defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger>
								Cities{' '}
								<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/cities">List Cities</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/cities/new">Create City</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Collapsible title="Places" defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger>
								Places{' '}
								<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/places">List Places</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/places/new">Create Place</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Collapsible title="Users" defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger>
								Users{' '}
								<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/users">List Users</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Collapsible
					title="Collections"
					defaultOpen
					className="group/collapsible"
				>
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger>
								Collections{' '}
								<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/collections">List Collections</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/collections/new">
												Create Collection
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/collections/relations">
												Place Relations
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/collections/relations">
												City Relations
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Collapsible title="Reports" defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className="group/label text-sidebar-foreground text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							<CollapsibleTrigger>
								Reports{' '}
								<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={false}>
											<Link to="/dashboard/reports" search={{}}>
												List Reports
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>
		</ShadcnSidebar>
	);
}
