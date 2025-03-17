import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Expanded country codes data with Taiwan and more countries
const countryCodes = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  error,
  className,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Parse initial value if it exists
  useEffect(() => {
    if (value) {
      // Try to match a country code from the value
      const matchedCountry = countryCodes.find((country) =>
        value.startsWith(country.code)
      );

      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setPhoneNumber(value.substring(matchedCountry.code.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Remove all non-digit characters except spaces and dashes
    const cleaned = input.replace(/[^\d\s-]/g, "");

    // Apply formatting based on country format
    let formatted = cleaned;
    if (selectedCountry.code === "+1") {
      // Format as: XXX-XXX-XXXX for US/Canada
      if (cleaned.length <= 3) {
        formatted = cleaned;
      } else if (cleaned.length <= 6) {
        formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      } else {
        formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
          3,
          6
        )}-${cleaned.slice(6, 10)}`;
      }
    }

    setPhoneNumber(formatted);

    // Combine country code and phone number for the full value
    const fullNumber = `${selectedCountry.code} ${formatted}`;
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: (typeof countryCodes)[0]) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearchQuery("");

    // Update the full phone number with the new country code
    const fullNumber = `${country.code} ${phoneNumber}`;
    onChange(fullNumber);
  };

  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? countryCodes.filter(
        (country) =>
          country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.includes(searchQuery)
      )
    : countryCodes;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[120px] justify-between"
            >
              <span className="flex items-center">
                <span className="mr-1">{selectedCountry.flag}</span>
                {selectedCountry.code}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[250px] p-0"
            align="start"
            sideOffset={5}
            side="bottom"
          >
            <Command>
              <CommandInput
                placeholder="Search country..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <CommandList className="max-h-[300px] overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={`${country.code}-${country.country}`}
                      value={`${country.country} ${country.code}`}
                      onSelect={() => handleCountrySelect(country)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCountry.code === country.code &&
                            selectedCountry.country === country.country
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="mr-2">{country.flag}</span>
                      <span>{country.country}</span>
                      <span className="ml-auto text-muted-foreground">
                        {country.code}
                      </span>
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={cn("flex-1", className)}
          placeholder={
            selectedCountry.code === "+1"
              ? "123-456-7890"
              : "Enter phone number"
          }
          aria-invalid={!!error}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Select your country code and enter your phone number
      </p>
    </div>
  );
}
