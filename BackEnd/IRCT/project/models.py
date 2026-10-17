from django.db import models


class Project:
    def __init__(
        self, project_name, project_code, location, date, client, consultant, contractor
    ):
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

    def generateProjectFile(self):
        pass


# Class for Manufacture (e.g., Schneider-Micom)
class Manufacture(models.Model):
    Name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.Name


# Class for Relay Type (e.g., P12x, P132, etc.)
class RelayType(models.Model):
    Relay = models.ForeignKey(
        "Relay", on_delete=models.CASCADE, related_name="relay_types"
    )
    Type_Name = models.CharField(
        max_length=100
    )  # You can define the fields for RelayType here

    Ith_Ir = models.FloatField()

    def ProtectionFunctions(self):
        # Fetches all RelayType instances related to this Relay instance
        return self.ProtectionFunction.all()

    def __str__(self):
        return (
            self.Type_Name + "|||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
        )


class Cal_Acc_To(models.Model):
    Value = models.CharField(max_length=100)
    RelayType = models.ForeignKey(
        RelayType, on_delete=models.CASCADE, related_name="Cal_Acc_To"
    )

    def __str__(self):
        return f"{self.Value} (RelayType: {self.RelayType})"

class CTClass(models.Model):
    value = models.CharField(max_length=10000)
    Cal_Acc_To = models.ForeignKey(
        Cal_Acc_To,
        on_delete=models.CASCADE,
        related_name="CTClass",
        null=True,
        blank=True,
    )
    


class ProtectionFunction(models.Model):
    Formula = models.CharField(max_length=1000)
    RelayType = models.ForeignKey(
        RelayType, on_delete=models.CASCADE, related_name="ProtectionFunction"
    )


# Class for Ir(A)
class IrnA(models.Model):
    Value = models.FloatField()
    RelayType = models.ForeignKey(
        RelayType, on_delete=models.CASCADE, related_name="IrnA", null=True
    )
    BurdenPhaseVA = models.FloatField()
    # BurdenEarthVA = models.FloatField()

    def __str__(self) -> str:
        return str(self.Value)


class Ith(models.Model):
    pass


# Class for Relay
class Relay(models.Model):  # A class representing A2 Relay
    Relay_Name = models.CharField(max_length=70)
    Manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.Relay_Name

    def RelayTypes(self):
        # Fetches all RelayType instances related to this Relay instance
        return self.relay_types.all()


# ! ! ! ! B Parameters ! ! ! ! #


# B1:
class B1(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    ProtectionFunction = models.ForeignKey(ProtectionFunction, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


# B2:
class B2(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    ProtectionFunction = models.ForeignKey(ProtectionFunction, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


# B3:
class B3(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    ProtectionFunction = models.ForeignKey(ProtectionFunction, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


# B4:
class B4(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    ProtectionFunction = models.ForeignKey(ProtectionFunction, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


class B46(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    B4 = models.ForeignKey(B4, on_delete=models.CASCADE)
    Value = models.CharField(max_length=1000, default="")


# B5:
class B5(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    ProtectionFunction = models.ForeignKey(ProtectionFunction, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


class B59(models.Model):
    B5 = models.ForeignKey(B5, on_delete=models.CASCADE)
    Value = models.CharField(max_length=1000, default="")


class B57(models.Model):
    B59 = models.ForeignKey(B59, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


# B6:
class B6(models.Model):  # Overcurrent/Earth fault Protection
    # FK to A3 (Protection Function)
    ProtectionFunction = models.ForeignKey(ProtectionFunction, on_delete=models.CASCADE)
    ValueToGetActivatedOn = models.CharField(max_length=1000, default="")


# ! ! ! ! C Parameters ! ! ! ! #


# C1
class CT(models.Model):
    name = models.CharField(max_length=1000)

    def __str__(self):
        return self.name


# C2
class Standard(models.Model):
    ct = models.ForeignKey(CT, on_delete=models.CASCADE)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.value} (CT: {self.ct.name})"


# C3
class C3(models.Model):
    CT = models.ForeignKey(CT, on_delete=models.CASCADE)
    A7 = models.ForeignKey(Cal_Acc_To, on_delete=models.CASCADE)
    C2 = models.ForeignKey(Standard, on_delete=models.CASCADE)
    Value = models.CharField(max_length=1000, default="")


# ! C4, C5 doesn't need database relations!


# C6
class C6(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        """
        Checks if the related C3 instance has a C2 value that matches one of the allowed activation values.
        """
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C6 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC6(models.Model):  # So C6 activation could be adjusted
    C6 = models.ForeignKey(
        C6, on_delete=models.CASCADE, related_name="activation_values"
    )
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C7(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        """
        Checks if the related C3 instance has a C2 value that matches one of the allowed activation values.
        """
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C7 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC7(models.Model):  # So C7 activation could be adjusted
    C7 = models.ForeignKey(
        C7, on_delete=models.CASCADE, related_name="activation_values"
    )
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C8(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        """
        Checks if the related C3 instance has a C2 value that matches one of the allowed activation values.
        """
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C7 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC7(models.Model):  # So C7 activation could be adjusted
    C7 = models.ForeignKey(
        C7, on_delete=models.CASCADE, related_name="activation_values"
    )
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value




class C8(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C8 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC8(models.Model):
    C8 = models.ForeignKey(C8, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C9(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C9 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC9(models.Model):
    C9 = models.ForeignKey(C9, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C10(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C10 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC10(models.Model):
    C10 = models.ForeignKey(C10, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C11(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C11 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC11(models.Model):
    C11 = models.ForeignKey(C11, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C12(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C12 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC12(models.Model):
    C12 = models.ForeignKey(C12, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C13(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C13 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC13(models.Model):
    C13 = models.ForeignKey(C13, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C14(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C14 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC14(models.Model):
    C14 = models.ForeignKey(C14, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class C15(models.Model):
    C3 = models.ForeignKey(C3, on_delete=models.CASCADE)

    def is_active(self):
        return self.activation_values.filter(value=self.C3.C2.value).exists()

    def __str__(self):
        return f"C15 for {self.C3} - Active: {self.is_active()}"


class ActivationValueC15(models.Model):
    C15 = models.ForeignKey(C15, on_delete=models.CASCADE, related_name="activation_values")
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value


class WorkSpace(models.Model):
    path = models.CharField(max_length=500)
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} at {self.path}"