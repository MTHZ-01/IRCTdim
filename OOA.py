# Top-Level Class
class Project:
    def __init__(self, project_name, project_code, location, date, client, consultant, contractor):
        self.project_name = project_name
        self.project_code = project_code
        self.location = location
        self.date = date
        self.client = client  # Client object
        self.consultant = consultant  # Consultant object
        self.contractor = contractor  # Contractor object
        self.current_transformers = []  # List of CT objects
        self.relays = []  # List of Relay objects
        self.system_info = None  # SystemInformation object

    def generate_final_report(self):
        # Generate the final report logic
        pass

    def add_ct(self, ct):
        self.current_transformers.append(ct)

    def add_relay(self, relay):
        self.relays.append(relay)


# Person Base Class
class Person:
    def __init__(self, name, role, company):
        self.name = name
        self.role = role
        self.company = company

    def get_details(self):
        return f"{self.name}, {self.role} at {self.company}"


# Client Class
class Client(Person):
    def __init__(self, name, role, company, requirements):
        super().__init__(name, role, company)
        self.requirements = requirements

    def submit_requirements(self):
        # Logic to submit client's requirements
        pass


# Consultant Class
class Consultant(Person):
    def __init__(self, name, role, company, expertise_area):
        super().__init__(name, role, company)
        self.expertise_area = expertise_area

    def perform_calculations(self):
        # Logic for consultant to perform calculations
        pass

    def validate_system(self):
        # Logic for system validation
        pass


# Contractor Class
class Contractor(Person):
    def __init__(self, name, role, company, contract_details):
        super().__init__(name, role, company)
        self.contract_details = contract_details

    def submit_ct_parameters(self):
        # Logic for contractor to submit CT parameters
        pass


# CT (Current Transformer) Class
from django.db import models

class SystemInformation(models.Model):
    cable_cross_section = models.FloatField()
    length_of_cable = models.FloatField()
    max_fault_current = models.FloatField()
    reactance_resistance_ratio = models.FloatField()
    # Other system-related attributes


class CT(models.Model):
    ct_id = models.CharField(max_length=100)
    primary_current = models.FloatField()
    secondary_current = models.FloatField()
    resistance = models.FloatField()
    burden = models.FloatField()
    Vk_required = models.FloatField()
    Vk_calculated = models.FloatField()
    system_info = models.ForeignKey(SystemInformation, on_delete=models.CASCADE)
    # Method to accept a relay and evaluate if it's a fit
    def acceptRelay(self, relay):
        # Check if the relay is a fit
        if relay.burden <= self.burden:
            return True
        return False
    
    def calculateVk(self):
        # Logic to calculate Vk based on CT properties
        pass

    def validateVk(self):
        # Validation of calculated Vk against required Vk
        return self.Vk_calculated >= self.Vk_required


# Relay Class
class Relay(models.Model):
    relay_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=100)
    burden = models.FloatField()
    ct = models.ForeignKey(CT, on_delete=models.CASCADE)

    def connectToCT(self, ct):
        if ct.acceptRelay(self):
            self.ct = ct
            self.save()
            return True
        return False

# System Information Class
class SystemInformation:
    def __init__(self, system_id, cable_cross_section, length_of_cable, max_fault_current, reactance_resistance_ratio):
        self.system_id = system_id
        self.cable_cross_section = cable_cross_section
        self.length_of_cable = length_of_cable
        self.max_fault_current = max_fault_current
        self.reactance_resistance_ratio = reactance_resistance_ratio

    def calculate_lead_resistance(self):
        # Logic to calculate the resistance of the cable
        return self.length_of_cable * self.cable_cross_section


# CT Report Class, inherits from Project
class CTReport(Project):
    def __init__(self, project_name, project_code, location, date, client, consultant, contractor, document_title, revision, report_date):
        super().__init__(project_name, project_code, location, date, client, consultant, contractor)
        self.document_title = document_title
        self.revision = revision
        self.report_date = report_date

    def generate_summary(self):
        # Logic for generating report summary
        pass

    def generate_detailed_report(self):
        # Logic for generating detailed report
        pass
