import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Shield, ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useConfig } from "./config-panel";
import { Carrier, CarrierGroup } from "@/lib/carriers";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// Simulated list of all available carriers for search
const allAvailableCarriers: Carrier[] = [
  {
    id: "usaa",
    name: "USAA",
    logo: "",
    hasLogo: false
  },
  {
    id: "statefarm",
    name: "State Farm",
    logo: "",
    hasLogo: false
  },
  {
    id: "farmers",
    name: "Farmers",
    logo: "",
    hasLogo: false
  },
  {
    id: "amica",
    name: "Amica",
    logo: "",
    hasLogo: false
  },
  {
    id: "auto-owners",
    name: "Auto-Owners Insurance",
    logo: "",
    hasLogo: false
  },
  {
    id: "mercury",
    name: "Mercury",
    logo: "",
    hasLogo: false
  },
  {
    id: "the-hartford",
    name: "The Hartford",
    logo: "",
    hasLogo: false
  },
  {
    id: "american-family",
    name: "American Family",
    logo: "",
    hasLogo: false
  },
  {
    id: "erie",
    name: "Erie Insurance",
    logo: "",
    hasLogo: false
  },
];

export function CarrierManagement() {
  const { carrierGroups, setCarrierGroups, setOnboardingStep } = useConfig();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Carrier[]>([]);
  const [activeCarrier, setActiveCarrier] = useState<Carrier | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter search results based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Filter from all available carriers excluding ones already in groups
    const allGroupCarrierIds = [
      ...carrierGroups.primary.map(c => c.id),
      ...carrierGroups.secondary.map(c => c.id),
      ...carrierGroups.tertiary.map(c => c.id)
    ];
    
    const filtered = allAvailableCarriers.filter(carrier => 
      carrier.name.toLowerCase().includes(lowerSearchTerm) && 
      !allGroupCarrierIds.includes(carrier.id)
    );
    
    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchTerm, carrierGroups]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const [id, group] = active.id.toString().split(":");
    
    // Find the carrier being dragged
    const carrier = carrierGroups[group as CarrierGroup].find(c => c.id === id);
    if (carrier) {
      setActiveCarrier(carrier);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCarrier(null);
    
    if (!over) return;
    
    const [carrierId, sourceGroup] = active.id.toString().split(":");
    const targetGroup = over.id.toString() as CarrierGroup;

    // Don't do anything if dropping in same group
    if (sourceGroup === targetGroup) return;
    
    // Find the carrier in the source group
    const carrierIndex = carrierGroups[sourceGroup as CarrierGroup].findIndex(
      c => c.id === carrierId
    );
    
    if (carrierIndex === -1) return;
    
    // Create new state
    const newGroups = JSON.parse(JSON.stringify(carrierGroups));
    
    // Remove from source group
    const [carrier] = newGroups[sourceGroup as CarrierGroup].splice(carrierIndex, 1);
    
    // Add to target group
    newGroups[targetGroup].push(carrier);
    
    // Update state
    setCarrierGroups(newGroups);
  };

  // Add a carrier from search results to primary group
  const handleAddCarrier = (carrier: Carrier) => {
    const newGroups = JSON.parse(JSON.stringify(carrierGroups));
    newGroups.primary.push(carrier);
    setCarrierGroups(newGroups);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const handleBack = () => {
    setOnboardingStep('completed-first-step');
  };

  const handleNext = () => {
    // In a real app we'd save the carrier preferences here first
    // Then move to next step (coverages)
    alert("Moving to coverages step (not implemented in prototype)");
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Onboarding Stepper */}
      <div className="mb-8 bg-gray-50 rounded-lg overflow-hidden flex border">
        <div className="flex-1 bg-orange-100 py-3 px-5 text-center border-r">
          <span className="text-sm font-medium text-foreground">1. Carriers</span>
        </div>
        <div className="flex-1 py-3 px-5 text-center border-r">
          <span className="text-sm text-muted-foreground">2. Coverages</span>
        </div>
        <div className="flex-1 py-3 px-5 text-center border-r">
          <span className="text-sm text-muted-foreground">3. Automation</span>
        </div>
        <div className="flex-1 py-3 px-5 text-center">
          <span className="text-sm text-muted-foreground">4. Preferences</span>
        </div>
      </div>
      
      <div className="mb-6 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search to add carriers"
            className="pl-9 h-10 text-sm border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => searchTerm && setShowSearchResults(true)}
          />
        </div>
        
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 rounded-md border border-gray-200 bg-white shadow-md">
            <ul className="py-1 max-h-60 overflow-auto">
              {searchResults.map((carrier) => (
                <li 
                  key={carrier.id}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAddCarrier(carrier)}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md border border-gray-100 overflow-hidden mr-3">
                    {carrier.hasLogo ? (
                      <Image 
                        src={carrier.logo} 
                        alt={`${carrier.name} logo`}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <Shield className="h-5 w-5 text-gray-300 fill-gray-100" />
                    )}
                  </div>
                  <span className="text-sm">{carrier.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showSearchResults && searchResults.length === 0 && searchTerm && (
          <div className="absolute z-10 w-full mt-1 rounded-md border border-gray-200 bg-white shadow-md">
            <div className="p-3 text-center text-sm text-gray-500">
              No carriers found
            </div>
          </div>
        )}
      </div>

      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          <CarrierGroupDroppable 
            title="Primary Carriers" 
            description="These are the carriers we'll attempt to quote with first"
            groupId="primary"
            carriers={carrierGroups.primary}
          />
          
          <CarrierGroupDroppable 
            title="Secondary Carriers" 
            description="These are the carriers we'll attempt to quote with second"
            groupId="secondary"
            carriers={carrierGroups.secondary}
          />
          
          <CarrierGroupDroppable 
            title="Tertiary Carriers" 
            description="These are the carriers we'll attempt to quote with if needed"
            groupId="tertiary"
            carriers={carrierGroups.tertiary}
          />
        </div>

        <DragOverlay>
          {activeCarrier ? (
            <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200 shadow-md">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md overflow-hidden">
                {activeCarrier.hasLogo ? (
                  <Image 
                    src={activeCarrier.logo} 
                    alt={`${activeCarrier.name} logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                ) : (
                  <Shield className="h-5 w-5 text-gray-300 fill-gray-100" />
                )}
              </div>
              <span className="text-sm">{activeCarrier.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center">
        {/* Left side - Save button */}
        <div>
          <Button
            variant="outline"
            className="text-sm"
          >
            Save
          </Button>
        </div>

        {/* Right side - Back and Next buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <span className="text-sm">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CarrierGroupProps {
  title: string;
  description: string;
  groupId: CarrierGroup;
  carriers: Carrier[];
}

function CarrierGroupDroppable({ title, description, groupId, carriers }: CarrierGroupProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: groupId,
  });

  return (
    <div className={`border rounded-lg bg-white overflow-hidden ${isOver ? 'ring-2 ring-orange-500/50' : ''}`}>
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      
      <div 
        ref={setNodeRef}
        className="min-h-[100px]"
      >
        {carriers.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-sm text-gray-400">
            Drag carriers here
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {carriers.map((carrier) => (
              <DraggableCarrier 
                key={`${carrier.id}:${groupId}`}
                id={`${carrier.id}:${groupId}`}
                carrier={carrier}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface DraggableCarrierProps {
  id: string;
  carrier: Carrier;
}

function DraggableCarrier({ id, carrier }: DraggableCarrierProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md border border-gray-100 overflow-hidden">
          {carrier.hasLogo ? (
            <Image 
              src={carrier.logo} 
              alt={`${carrier.name} logo`}
              width={32}
              height={32}
              className="object-contain"
            />
          ) : (
            <Shield className="h-5 w-5 text-gray-300 fill-gray-100" />
          )}
        </div>
        <span className="text-sm">{carrier.name}</span>
      </div>
      <Menu className="h-5 w-5 text-gray-400" />
    </div>
  );
} 