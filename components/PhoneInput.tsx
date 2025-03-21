import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/app/hooks/utils";
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

// Country codes with format examples and validation patterns
const countryCodes = [
  {
    code: "+1",
    country: "United States",
    flag: "🇺🇸",
    example: "123-456-7890",
    format: "XXX-XXX-XXXX",
    pattern: /^\d{3}-\d{3}-\d{4}$/,
    maxLength: 12, // Including dashes
  },
  {
    code: "+1",
    country: "Canada",
    flag: "🇨🇦",
    example: "123-456-7890",
    format: "XXX-XXX-XXXX",
    pattern: /^\d{3}-\d{3}-\d{4}$/,
    maxLength: 12,
  },
  {
    code: "+44",
    country: "United Kingdom",
    flag: "🇬🇧",
    example: "7911 123456",
    format: "XXXX XXXXXX",
    pattern: /^\d{4,5}\s\d{6,7}$/,
    maxLength: 13,
  },
  {
    code: "+61",
    country: "Australia",
    flag: "🇦🇺",
    example: "412 345 678",
    format: "XXX XXX XXX",
    pattern: /^\d{3}\s\d{3}\s\d{3}$/,
    maxLength: 11,
  },
  {
    code: "+33",
    country: "France",
    flag: "🇫🇷",
    example: "6 12 34 56 78",
    format: "X XX XX XX XX",
    pattern: /^\d(\s\d{2}){4}$/,
    maxLength: 14,
  },
  {
    code: "+49",
    country: "Germany",
    flag: "🇩🇪",
    example: "170 1234567",
    format: "XXX XXXXXXX",
    pattern: /^\d{3,5}\s\d{6,8}$/,
    maxLength: 15,
  },
  {
    code: "+81",
    country: "Japan",
    flag: "🇯🇵",
    example: "90-1234-5678",
    format: "XX-XXXX-XXXX",
    pattern: /^\d{2,3}-\d{4}-\d{4}$/,
    maxLength: 13,
  },
  {
    code: "+86",
    country: "China",
    flag: "🇨🇳",
    example: "139 1234 5678",
    format: "XXX XXXX XXXX",
    pattern: /^\d{3}\s\d{4}\s\d{4}$/,
    maxLength: 14,
  },
  {
    code: "+886",
    country: "Taiwan",
    flag: "🇹🇼",
    example: "912 345 678",
    format: "XXX XXX XXX",
    pattern: /^\d{3}\s\d{3}\s\d{3}$/,
    maxLength: 11,
  },
  {
    code: "+852",
    country: "Hong Kong",
    flag: "🇭🇰",
    example: "9123 4567",
    format: "XXXX XXXX",
    pattern: /^\d{4}\s\d{4}$/,
    maxLength: 9,
  },
  {
    code: "+91",
    country: "India",
    flag: "🇮🇳",
    example: "98765 43210",
    format: "XXXXX XXXXX",
    pattern: /^\d{5}\s\d{5}$/,
    maxLength: 11,
  },
  // Keep the rest of your country codes but add the example, format, pattern and maxLength properties
  // ...
];

// Add the missing properties to the rest of the countries
const enhancedCountryCodes = countryCodes.map((country) => {
  // If the country already has all properties, return it as is
  if (
    country.example &&
    country.format &&
    country.pattern &&
    country.maxLength
  ) {
    return country;
  }

  // Default values for countries without specific formats
  return {
    ...country,
    example: country.example || "123 456 7890",
    format: country.format || "XXX XXX XXXX",
    pattern: country.pattern || /^\d{3}\s\d{3}\s\d{4}$/,
    maxLength: country.maxLength || 12,
  };
});

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
  const [selectedCountry, setSelectedCountry] = useState(
    enhancedCountryCodes[0]
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Parse initial value if it exists
  useEffect(() => {
    if (value) {
      // Try to match a country code from the value
      const matchedCountry = enhancedCountryCodes.find((country) =>
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

  // Format phone number based on country
  const formatPhoneNumber = (
    input: string,
    country: (typeof enhancedCountryCodes)[0]
  ): string => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");

    if (digits.length === 0) return "";

    // Apply formatting based on country
    if (country.code === "+1") {
      // Format as: XXX-XXX-XXXX for US/Canada
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
          6,
          10
        )}`;
      }
    } else if (country.code === "+44") {
      // UK format
      if (digits.length <= 4) {
        return digits;
      } else {
        return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      }
    } else if (country.code === "+61") {
      // Australia format
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
          6,
          9
        )}`;
      }
    } else if (country.code === "+86") {
      // China format
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 7) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(
          7,
          11
        )}`;
      }
    } else if (country.code === "+91") {
      // India format
      if (digits.length <= 5) {
        return digits;
      } else {
        return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
      }
    } else if (country.code === "+81") {
      // Japan format
      if (digits.length <= 2) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      } else {
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(
          6,
          10
        )}`;
      }
    } else if (country.code === "+886") {
      // Taiwan format
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
          6,
          9
        )}`;
      }
    } else {
      // Generic format with spaces after every 3 digits
      return digits.replace(/(\d{3})/g, "$1 ").trim();
    }
  };

  // Validate phone number
  const validatePhoneNumber = (
    number: string,
    country: (typeof enhancedCountryCodes)[0]
  ): boolean => {
    if (!number) return true; // Empty is valid (optional field)

    // Check if the number matches the country's pattern
    return country.pattern.test(number);
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Don't allow input beyond max length
    if (input.replace(/\D/g, "").length > selectedCountry.maxLength) {
      return;
    }

    // Format the input according to the country's format
    const formatted = formatPhoneNumber(input, selectedCountry);
    setPhoneNumber(formatted);

    // Validate the formatted number
    const isValid = validatePhoneNumber(formatted, selectedCountry);

    if (formatted && !isValid) {
      setValidationError(
        `Please enter a valid ${selectedCountry.country} phone number`
      );
    } else {
      setValidationError(null);
    }

    // Combine country code and phone number for the full value
    const fullNumber = formatted ? `${selectedCountry.code} ${formatted}` : "";
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: (typeof enhancedCountryCodes)[0]) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearchQuery("");

    // Reformat the phone number according to the new country format
    const digits = phoneNumber.replace(/\D/g, "");
    const formatted = formatPhoneNumber(digits, country);
    setPhoneNumber(formatted);

    // Validate with the new country format
    const isValid = validatePhoneNumber(formatted, country);
    if (formatted && !isValid) {
      setValidationError(
        `Please enter a valid ${country.country} phone number`
      );
    } else {
      setValidationError(null);
    }

    // Update the full phone number with the new country code
    const fullNumber = formatted ? `${country.code} ${formatted}` : "";
    onChange(fullNumber);
  };

  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? enhancedCountryCodes.filter(
        (country) =>
          country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.includes(searchQuery)
      )
    : enhancedCountryCodes;

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
          className={cn(
            "flex-1",
            validationError ? "border-red-500 focus-visible:ring-red-500" : "",
            className
          )}
          placeholder={selectedCountry.example}
          aria-invalid={!!error || !!validationError}
        />
      </div>
      {(error || validationError) && (
        <p className="text-red-500 text-xs">{error || validationError}</p>
      )}
      <p className="text-xs text-muted-foreground">
        Format: {selectedCountry.format} (Example: {selectedCountry.example})
      </p>
    </div>
  );
}
